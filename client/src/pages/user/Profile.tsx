import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Building, Phone, MapPin, Upload } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const handleSave = () => {
    toast.success("Perfil actualizado correctamente");
  };

  const handlePasswordChange = () => {
    toast.success("Contraseña cambiada correctamente");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Mi Perfil</h2>
        <p className="text-muted-foreground">
          Gestiona tu información personal
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Foto de perfil</CardTitle>
            <CardDescription>
              Actualiza tu imagen de perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Button variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Subir nueva foto
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              JPG, PNG o GIF. Máximo 5MB.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle>Información personal</CardTitle>
            <CardDescription>
              Actualiza tus datos de contacto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="firstName" className="pl-10" defaultValue="Juan" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellidos</Label>
                <Input id="lastName" defaultValue="Pérez García" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" className="pl-10" defaultValue="juan@empresa.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="company" className="pl-10" defaultValue="Mi Empresa SL" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" className="pl-10" defaultValue="+34 612 345 678" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="location" className="pl-10" defaultValue="Madrid, España" />
                </div>
              </div>
            </div>

            <Button onClick={handleSave} variant="hero" className="w-full">
              Guardar cambios
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
          <CardDescription>
            Cambia tu contraseña y gestiona la seguridad de tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña actual</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input id="confirmPassword" type="password" />
            </div>
          </div>
          <Button onClick={handlePasswordChange} variant="outline" className="mt-4">
            Cambiar contraseña
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de peligro</CardTitle>
          <CardDescription>
            Acciones irreversibles sobre tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium">Eliminar cuenta</p>
              <p className="text-sm text-muted-foreground">
                Elimina permanentemente tu cuenta y todos tus datos
              </p>
            </div>
            <Button variant="destructive">
              Eliminar cuenta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
