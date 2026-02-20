import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">EZ</span>
              </div>
              <span className="text-xl font-bold">ElectroZone</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted destination for the latest electronics and gadgets.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=Smartphones" className="text-muted-foreground hover:text-foreground">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link href="/products?category=Laptops" className="text-muted-foreground hover:text-foreground">
                  Laptops
                </Link>
              </li>
              <li>
                <Link href="/products?category=Audio" className="text-muted-foreground hover:text-foreground">
                  Audio
                </Link>
              </li>
              <li>
                <Link href="/products?category=Wearables" className="text-muted-foreground hover:text-foreground">
                  Wearables
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/support/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ElectroZone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
