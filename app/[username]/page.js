// This would be in your app/[username]/page.js or pages/[username].js
import PaymentPage from '@/components/PaymentPage';

export default async function UserPage({ params }) {
    const { username } = await params; // ✅ now awaited
    return <PaymentPage username={username} />;
}


// Alternative for pages directory (Next.js 12 and below)
// export default function UserPage({ query }) {
//     const username = query?.username;
//     
//     return <PaymentPage username={username} />;
// }

// If using getServerSideProps or getStaticProps
// export async function getServerSideProps(context) {
//     const { username } = context.params;
//     
//     return {
//         props: {
//             username
//         }
//     };
// }