import { SignInForm } from "@neondatabase/auth/react/ui"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignInPage() {
  return (
    <div className="page-shell flex items-center justify-center">
      <Card className="surface-card w-full max-w-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <SignInForm localization={{}} />
        </CardContent>
      </Card>
    </div>
  )
}
