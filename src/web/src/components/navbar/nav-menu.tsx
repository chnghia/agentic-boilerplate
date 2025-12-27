import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import type { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
// import Link from "next/link";
import { Link } from 'react-router-dom'

export const NavMenu = (props: NavigationMenuProps) => (
    <NavigationMenu {...props}>
        <NavigationMenuList className="gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
            <NavigationMenuItem>
                <NavigationMenuLink asChild>
                    <Link to="#features">Features</Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuLink asChild>
                    <Link to="#pricing">Pricing</Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuLink asChild>
                    <Link to="#faq">FAQ</Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuLink asChild>
                    <Link to="#testimonials">Testimonials</Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
        </NavigationMenuList>
    </NavigationMenu>
);
