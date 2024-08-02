export default function Footer() {
    return (
        <>
        <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex flex-col items-center md:flex-row justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold">Secure Docs</h2>
          {/* <p className="text-sm">© {new Date().getFullYear()} PDF Data Masking. All rights reserved.</p> */}
        </div>
        <div className="flex space-x-6">
         Crafted  with ❤️ by Team &nbsp;<a href="https://github.com/Harshilmalhotra/pair-hacks-Lorem-ipsum" target="_blank" rel="noreferrer" className="hover:underline">Lorem Ipsum</a>
        </div>
      </div>
    </footer>
        </>

    )}