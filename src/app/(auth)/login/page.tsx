"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { loginSchema, type LoginSchema } from "schemas/auth.schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginSchema) => {
    try {
      console.log(data);
      // simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/dashboard")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access QuickTask
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                {errors.email && (
                  <div className="flex items-center gap-1 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.email.message}</span>
                  </div>
                )}
              </div>
              <Input id="email" type="email" {...register("email")} placeholder="Enter your email" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                {errors.password && (
                  <div className="flex items-center gap-1 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.password.message}</span>
                  </div>
                )}
              </div>
              <Input id="password" type="password" {...register("password")} placeholder="Enter your password" />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
            </Button>
            <div className="text-center text-sm">
              Don’t have an account?{" "}
              <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                Create one
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
