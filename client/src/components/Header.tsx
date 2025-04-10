import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <a className="text-primary-dark font-poppins font-bold text-2xl">
                PropertyFinder<span className="text-primary">.ae</span>
              </a>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/properties/buy">
              <a className={`font-medium ${location === '/properties/buy' ? 'text-primary' : 'hover:text-primary'}`}>
                Buy
              </a>
            </Link>
            <Link href="/properties/rent">
              <a className={`font-medium ${location === '/properties/rent' ? 'text-primary' : 'hover:text-primary'}`}>
                Rent
              </a>
            </Link>
            <Link href="/properties/commercial">
              <a className={`font-medium ${location === '/properties/commercial' ? 'text-primary' : 'hover:text-primary'}`}>
                Commercial
              </a>
            </Link>
            <Link href="/properties/new-projects">
              <a className={`font-medium ${location === '/properties/new-projects' ? 'text-primary' : 'hover:text-primary'}`}>
                New Projects
              </a>
            </Link>
            <Link href="/agents">
              <a className={`font-medium ${location === '/agents' ? 'text-primary' : 'hover:text-primary'}`}>
                Find Agents
              </a>
            </Link>
            <Link href="/blog">
              <a className={`font-medium ${location === '/blog' ? 'text-primary' : 'hover:text-primary'}`}>
                Blog
              </a>
            </Link>
            <Link href="/ai-search">
              <a className={`font-medium ${location === '/ai-search' ? 'text-primary' : 'hover:text-primary'}`}>
                <span className="flex items-center">
                  <span className="mr-1">✨</span> AI Search
                </span>
              </a>
            </Link>
          </nav>

          {/* User actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="hover:text-primary flex items-center">
              <i className="far fa-heart mr-1"></i>
              <span>Saved</span>
            </Button>
            <Button className="bg-primary text-white hover:bg-blue-600 transition duration-300">
              Sign In
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-transparent border-none focus:outline-none">
                EN
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>EN</DropdownMenuItem>
                <DropdownMenuItem>AR</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="text-text-dark" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full z-20">
          <div className="flex flex-col py-4 px-4">
            <Link href="/properties/buy">
              <a className="font-medium py-2 hover:text-primary">Buy</a>
            </Link>
            <Link href="/properties/rent">
              <a className="font-medium py-2 hover:text-primary">Rent</a>
            </Link>
            <Link href="/properties/commercial">
              <a className="font-medium py-2 hover:text-primary">Commercial</a>
            </Link>
            <Link href="/properties/new-projects">
              <a className="font-medium py-2 hover:text-primary">New Projects</a>
            </Link>
            <Link href="/agents">
              <a className="font-medium py-2 hover:text-primary">Find Agents</a>
            </Link>
            <Link href="/blog">
              <a className="font-medium py-2 hover:text-primary">Blog</a>
            </Link>
            <div className="border-t my-2"></div>
            <Button variant="ghost" className="justify-start hover:text-primary py-2">
              <i className="far fa-heart mr-1"></i>
              <span>Saved</span>
            </Button>
            <Button className="bg-primary text-white mt-2 hover:bg-blue-600">
              Sign In
            </Button>
            <div className="flex mt-4">
              <Button variant="outline" className="mr-2">EN</Button>
              <Button variant="outline">AR</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
