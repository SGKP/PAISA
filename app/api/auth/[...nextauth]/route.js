import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import mongoose from "mongoose";
import User from "@/models/User";
import Payment from "@/models/Payment";
import connectDB from "@/db/connectDb";

export const authoptions = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider == "github") {
        try {
          // Connect to MongoDB
          await mongoose.connect(process.env.MONGO);
          
          // Check if the user already exists in the database
          const currentUser = await User.findOne({ email: user.email });
          
          if (!currentUser) {
            // Create a new User
            const newUser = new User({
              email: user.email,
              username: user.email.split('@')[0],
            });
            await newUser.save();
            user.name = newUser.username;
          }
          // For existing users, the session callback will handle setting the username
          
          return true;
        } catch (error) {
           return false;
        }
      }
      return true;
    },

    async session({ session, token, user }) {
      try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO);
        
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
          session.user.name = dbUser.username;
        }
        return session;
      } catch (error) {
         return session;
      }
    },
  }
})

export { authoptions as GET, authoptions as POST }