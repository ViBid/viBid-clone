import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-primary-dark text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-xl font-poppins font-semibold mb-4">PropertyFinder.ae</h3>
            <p className="mb-4 text-gray-300">
              The UAE's leading property portal, connecting buyers, sellers, tenants and landlords.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-white hover:text-primary"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white hover:text-primary"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-white hover:text-primary"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          
          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-medium mb-4">Buy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties/buy">
                  <a className="text-gray-300 hover:text-white">Properties for Sale</a>
                </Link>
              </li>
              <li>
                <Link href="/properties/new-projects">
                  <a className="text-gray-300 hover:text-white">New Projects</a>
                </Link>
              </li>
              <li>
                <Link href="/properties/commercial/buy">
                  <a className="text-gray-300 hover:text-white">Commercial for Sale</a>
                </Link>
              </li>
              <li>
                <Link href="/areas-guide">
                  <a className="text-gray-300 hover:text-white">Areas Guide</a>
                </Link>
              </li>
              <li>
                <Link href="/property-prices">
                  <a className="text-gray-300 hover:text-white">Property Prices</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-medium mb-4">Rent</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties/rent">
                  <a className="text-gray-300 hover:text-white">Properties for Rent</a>
                </Link>
              </li>
              <li>
                <Link href="/rental-yield">
                  <a className="text-gray-300 hover:text-white">Rental Yield</a>
                </Link>
              </li>
              <li>
                <Link href="/properties/commercial/rent">
                  <a className="text-gray-300 hover:text-white">Commercial for Rent</a>
                </Link>
              </li>
              <li>
                <Link href="/properties/room">
                  <a className="text-gray-300 hover:text-white">Room for Rent</a>
                </Link>
              </li>
              <li>
                <Link href="/rental-guide">
                  <a className="text-gray-300 hover:text-white">Rental Guide</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4 */}
          <div>
            <h3 className="text-lg font-medium mb-4">About Us</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <a className="text-gray-300 hover:text-white">Our Story</a>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <a className="text-gray-300 hover:text-white">Careers</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-300 hover:text-white">Contact Us</a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-gray-300 hover:text-white">Terms of Service</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-gray-300 hover:text-white">Privacy Policy</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} PropertyFinder.ae. All Rights Reserved.
            </p>
            <div className="flex space-x-4">
              <select className="bg-transparent border border-gray-600 rounded text-white px-2 py-1 text-sm focus:outline-none">
                <option>English</option>
                <option>العربية</option>
              </select>
              <select className="bg-transparent border border-gray-600 rounded text-white px-2 py-1 text-sm focus:outline-none">
                <option>AED</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
