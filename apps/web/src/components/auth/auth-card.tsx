import type { ComponentProps, ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-4">{children}</CardContent>
      {footer && (
        <CardFooter className="justify-center gap-1 text-sm text-muted-foreground [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

export function AuthMessage({
  variant = "default",
  children,
}: {
  variant?: "default" | "destructive";
  children: ReactNode;
}) {
  return (
    <Alert variant={variant}>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}

export function AuthField({
  id,
  label,
  ...props
}: ComponentProps<"input"> & { id: string; label: string }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} {...props} />
    </div>
  );
}
