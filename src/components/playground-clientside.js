import {lazy} from "@loadable/component";
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Wrapper around the Playground component to use it on the client side only (and not via server-side rendering).
 * This is made necessary by the code editor, based on react-ace and ace-builds, which use `window` and don't seem to fully support SSR yet.
 * @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<{}> & React.RefAttributes<unknown>>}
 */
const LoadablePlayground = lazy(() => import("./playground/playground"));

export default function ClientSidePlayground(props) {
    const isSSR = typeof window === "undefined";

    return (
        <>
            {!isSSR && (
                <React.Suspense fallback={
                    <div className={"text-center playground-loader mt-4"}>
                        Loading playground <span className={"ms-2"}><FontAwesomeIcon icon={faSpinner} size={"lg"} spin/></span>
                    </div>
                }>
                <LoadablePlayground {...props}/>
                </React.Suspense>
            )}
        </>
    );
}
