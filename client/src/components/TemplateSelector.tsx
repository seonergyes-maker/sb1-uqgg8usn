import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Search } from "lucide-react";
import type { Template } from "@/lib/types";

interface TemplateSelectorProps {
  type: "Email" | "Landing";
  onSelect: (template: Template) => void;
  selectedTemplateId?: number;
}

export function TemplateSelector({ type, onSelect, selectedTemplateId }: TemplateSelectorProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates", { type }],
  });

  // Templates base son los que tienen clientId = 0
  const baseTemplates = templates.filter((t) => t.clientId === 0);
  
  const filteredTemplates = baseTemplates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(search.toLowerCase()) ||
                         template.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || template.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(baseTemplates.map((t) => t.category)));

  if (isLoading) {
    return <div className="text-center py-8" data-testid="loading-templates">Cargando templates...</div>;
  }

  return (
    <div className="space-y-4" data-testid="template-selector">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            data-testid="input-search-templates"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[200px]" data-testid="select-category">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground" data-testid="text-no-templates">
          No se encontraron templates base de tipo {type}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedTemplateId === template.id ? "border-primary border-2" : ""
              }`}
              onClick={() => onSelect(template)}
              data-testid={`card-template-${template.id}`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg" data-testid={`text-template-name-${template.id}`}>
                    {template.name}
                  </CardTitle>
                  <Badge variant="secondary" data-testid={`badge-category-${template.id}`}>
                    {template.category}
                  </Badge>
                </div>
                <CardDescription data-testid={`text-template-description-${template.id}`}>
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {template.timesUsed} usos
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/preview-template/${template.id}`, "_blank");
                    }}
                    data-testid={`button-preview-${template.id}`}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
