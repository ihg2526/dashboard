import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, name, type, image, url }) => {
    return (
        <Helmet>
            { /* Standard metadata tags */ }
            <title>{title}</title>
            <meta name='description' content={description} />
            
            { /* Facebook tags */ }
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {image && <meta property="og:image" content={image} />}
            {url && <meta property="og:url" content={url} />}
            
            { /* Twitter tags */ }
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content={type === 'article' ? 'summary_large_image' : 'summary'} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
}

// Default props
SEO.defaultProps = {
    title: '25/26 IHG Dashboard',
    description: 'Dashboard for NUS IHG 25/26 Sports Tournament',
    name: 'IHG Sports',
    type: 'website'
};

export default SEO;
