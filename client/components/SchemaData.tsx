import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function SchemaData() {
    const [seoData, setSeoData] = useState<any>(null);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'seo'), (docSnap) => {
            if (docSnap.exists() && docSnap.data().structuredDataEnabled) {
                setSeoData(docSnap.data());
            } else {
                setSeoData(null);
            }
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        if (!seoData) return;

        // Cleanup existing script if any
        const existingScript = document.getElementById('json-ld-schema');
        if (existingScript) existingScript.remove();

        const schema = {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": seoData.collegeName,
            "url": window.location.origin,
            "logo": `${window.location.origin}/star-icon.png`,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": seoData.address,
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": seoData.phone,
                "contactType": "customer service",
                "email": seoData.email
            },
            "sameAs": Object.values(seoData.socialLinks || {}).filter(url => url)
        };

        const script = document.createElement('script');
        script.id = 'json-ld-schema';
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(schema);
        document.head.appendChild(script);

        // Add Verification Meta if exists
        if (seoData.googleVerification) {
            let meta = document.querySelector('meta[name="google-site-verification"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', 'google-site-verification');
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', seoData.googleVerification);
        }

        // Add Global Keywords
        if (seoData.keywords) {
            let keywordsMeta = document.querySelector('meta[name="keywords"]');
            if (!keywordsMeta) {
                keywordsMeta = document.createElement('meta');
                keywordsMeta.setAttribute('name', 'keywords');
                document.head.appendChild(keywordsMeta);
            }
            keywordsMeta.setAttribute('content', seoData.keywords);
        }

        return () => {
            const scriptToRemove = document.getElementById('json-ld-schema');
            if (scriptToRemove) scriptToRemove.remove();
        };
    }, [seoData]);

    return null;
}
