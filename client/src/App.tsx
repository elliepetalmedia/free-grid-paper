import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import FAQ from "@/pages/faq";
import NotFound from "@/pages/not-found";
import TemplatesPage from "@/pages/templates";
import CategoryPage from "@/pages/category";
import PresetPage from "@/pages/preset";
import GuidePage from "@/pages/guide";
import SitePage from "@/pages/site-page";
import { templates } from "@/content";

function RootRedirect() {
  const [, navigate] = useLocation();

  useEffect(() => {
    navigate("/templates", { replace: true });
  }, [navigate]);

  return null;
}

function Router() {
  const templateRoutes = templates.map((template) => (
    <Route key={template.path} path={template.path} component={Home} />
  ));

  return (
    <Switch>
      <Route path="/" component={RootRedirect} />
      {templateRoutes}
      <Route path="/templates" component={TemplatesPage} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/preset/:slug" component={PresetPage} />
      <Route path="/guides/:slug" component={GuidePage} />
      <Route path="/faq" component={FAQ} />
      <Route path="/about">{() => <SitePage path="/about" />}</Route>
      <Route path="/contact">{() => <SitePage path="/contact" />}</Route>
      <Route path="/privacy">{() => <SitePage path="/privacy" />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
