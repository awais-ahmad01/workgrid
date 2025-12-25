import "./globals.css";
import StoreProvider from "./StoreProvider";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>              
            <main className="h-screen">
              {children}
            </main>          
        </StoreProvider>
      </body>
    </html>
  );
}
