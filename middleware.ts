import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // Add your authorization logic here
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/protected/:path*"],
};
