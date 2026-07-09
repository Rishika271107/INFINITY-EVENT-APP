import './globals.css';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'Infinity Event Dashboard',
  description: 'Project tracker dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1 ml-64">
          <Navbar />
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
