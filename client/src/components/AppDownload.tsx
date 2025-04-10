import { Button } from "@/components/ui/button";

export function AppDownload() {
  return (
    <section className="py-12 bg-primary-dark text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-poppins font-bold mb-4">Download the PropertyFinder App</h2>
            <p className="text-lg mb-6">Search for properties on the go with our mobile app. Available on iOS and Android.</p>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="bg-black text-white border-black px-6 py-6 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition duration-300 h-auto">
                <i className="fab fa-apple text-2xl"></i>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-medium">App Store</div>
                </div>
              </Button>
              
              <Button variant="outline" className="bg-black text-white border-black px-6 py-6 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition duration-300 h-auto">
                <i className="fab fa-google-play text-2xl"></i>
                <div>
                  <div className="text-xs">Get it on</div>
                  <div className="text-lg font-medium">Google Play</div>
                </div>
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=500&h=500&q=80" 
              alt="Mobile App" 
              className="w-64 h-auto rounded-lg shadow-lg" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
