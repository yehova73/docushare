import { ThemeProvider } from "next-themes";
import { PublicProviders } from "@/components/providers";
import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PublicProviders>
      <Navbar />
      {children}
      <Footer />
    </PublicProviders>
  );
};

export default Layout;
