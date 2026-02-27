import { useEffect } from 'react';

interface JsonLdProps {
    data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(data);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [data]);

    return null;
}
