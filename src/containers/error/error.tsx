import { routes } from "@/static-data/routes";
import { Link } from "react-router";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Error({
  resetErrorBoundry,
}: {
  resetErrorBoundry?: () => void;
}) {
  const handleBack = () => {
    resetErrorBoundry?.();
    window.history.back();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-xl border border-border/70 text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle className="text-4xl font-semibold">
            Page not found
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            The page you were looking for doesn’t exist or was moved. You can go
            back to where you came from or return to the dashboard to continue
            learning.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Try the following:</p>
          <ul className="space-y-2 text-left">
            <li className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              Double-check the URL for typos.
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              Navigate from the dashboard to find the right module.
            </li>
          </ul>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="flex-1">
            <Link to={routes.HOME} onClick={resetErrorBoundry}>
              <Home className="mr-2 h-4 w-4" />
              Return home
            </Link>
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleBack}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try previous page
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
