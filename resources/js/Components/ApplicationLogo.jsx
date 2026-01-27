
import React from 'react';

export default function ApplicationLogo({ logoSize = 'h-10 w-10', containerClasses = '' }) {
    const cdn = import.meta.env.VITE_ASSET_URL;
    return (
        <div className={`flex ${containerClasses}`}>
            <img src={`${cdn}/images/GraveYardJokesLogoJester.svg`} alt="GraveYardJokes Studios Logo" className={logoSize} />
        </div>
    );
}
