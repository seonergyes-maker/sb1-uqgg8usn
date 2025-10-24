import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Building, Phone, MapPin, Upload, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  location: string | null;
  avatarUrl: string | null;
  plan: string;
  registeredAt: string;
}

const profileSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  company: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  avatarUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "La contraseña actual es requerida"),
  newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Debes confirmar la nueva contraseña"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const Profile = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch profile data
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
    queryFn: () => apiRequest("/api/profile"),
  });

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      location: "",
      avatarUrl: "",
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update form when profile is loaded
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        name: profile.name || "",
        email: profile.email || "",
        company: profile.company || "",
        phone: profile.phone || "",
        location: profile.location || "",
        avatarUrl: profile.avatarUrl || "",
      });
    }
  }, [profile, profileForm]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) => apiRequest("/api/profile", "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil se ha actualizado correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al actualizar",
        description: error?.message || "No se pudo actualizar el perfil.",
        variant: "destructive",
      });
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: PasswordFormData) => apiRequest("/api/profile/change-password", "POST", data),
    onSuccess: () => {
      passwordForm.reset();
      toast({
        title: "Contraseña cambiada",
        description: "Tu contraseña se ha cambiado correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al cambiar contraseña",
        description: error?.message || "No se pudo cambiar la contraseña.",
        variant: "destructive",
      });
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    changePasswordMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Mi Perfil</h2>
        <p className="text-muted-foreground">
          Gestiona tu información personal
        </p>
      </div>

      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
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
                <AvatarImage src={profile?.avatarUrl || undefined} />
                <AvatarFallback className="text-2xl">
                  {profile?.name ? getInitials(profile.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="w-full space-y-2">
                <Label htmlFor="avatarUrl">URL de imagen</Label>
                <Input
                  id="avatarUrl"
                  data-testid="input-avatarUrl"
                  {...profileForm.register("avatarUrl")}
                  placeholder="https://ejemplo.com/mi-avatar.jpg"
                />
                {profileForm.formState.errors.avatarUrl && (
                  <p className="text-sm text-red-500">{profileForm.formState.errors.avatarUrl.message}</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Puedes usar un avatar de tu elección o uno generado automáticamente.
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
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    data-testid="input-name"
                    className="pl-10"
                    {...profileForm.register("name")}
                  />
                </div>
                {profileForm.formState.errors.name && (
                  <p className="text-sm text-red-500">{profileForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    data-testid="input-email"
                    className="pl-10"
                    {...profileForm.register("email")}
                  />
                </div>
                {profileForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{profileForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company"
                    data-testid="input-company"
                    className="pl-10"
                    {...profileForm.register("company")}
                    placeholder="Mi Empresa SL"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      data-testid="input-phone"
                      className="pl-10"
                      {...profileForm.register("phone")}
                      placeholder="+34 612 345 678"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      data-testid="input-location"
                      className="pl-10"
                      {...profileForm.register("location")}
                      placeholder="Madrid, España"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                className="w-full"
                data-testid="button-save-profile"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Guardando..." : "Guardar cambios"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
          <CardDescription>
            Cambia tu contraseña y gestiona la seguridad de tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña actual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  data-testid="input-currentPassword"
                  {...passwordForm.register("currentPassword")}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  data-testid="input-newPassword"
                  {...passwordForm.register("newPassword")}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  data-testid="input-confirmPassword"
                  {...passwordForm.register("confirmPassword")}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
            <Button
              type="submit"
              variant="outline"
              className="mt-4"
              data-testid="button-change-password"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? "Cambiando..." : "Cambiar contraseña"}
            </Button>
          </form>
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" data-testid="button-delete-account">
                  Eliminar cuenta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    ¿Estás absolutamente seguro?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta
                    y todos los datos asociados: leads, campañas, landing pages, segmentos y automatizaciones.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => {
                      toast({
                        title: "Funcionalidad no disponible",
                        description: "La eliminación de cuenta debe realizarse contactando con soporte.",
                      });
                    }}
                  >
                    Eliminar mi cuenta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
