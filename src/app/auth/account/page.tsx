import { AccountView } from "@neondatabase/auth/react/ui"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AccountPage() {
  return (
    <div className="page-shell">
      <Card className="surface-card mx-auto w-full max-w-2xl">
        <CardHeader className="pb-3">
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <AccountView />
        </CardContent>
      </Card>
    </div>
  )
}
