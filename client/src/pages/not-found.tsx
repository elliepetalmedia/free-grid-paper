import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useNotFoundMetadata } from "@/hooks/use-page-metadata";

export default function NotFound() {
  useNotFoundMetadata();
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            The page you are looking for could not be found.
          </p>
          <p className="mt-4 text-sm text-gray-600">
            <a href="/">Return to the homepage</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
