import { SignUpForm } from "@neondatabase/auth/react/ui"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpPage() {
  return (
    <div className="page-shell flex items-center justify-center">
      <Card className="surface-card w-full max-w-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <SignUpForm localization={{}} />
        </CardContent>
      </Card>
    </div>
  )
}
