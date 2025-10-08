import { ColorSchemeProvider } from "./ColorSchemeProvider";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <ColorSchemeProvider>{children}</ColorSchemeProvider>;
}
