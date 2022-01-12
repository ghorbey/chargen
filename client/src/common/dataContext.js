import React, { createContext, useContext } from "react";

const DataContext = createContext({ globalData: undefined });

export const Provider = (props) => {
    return (
        props.userId > 0
            ? <DataContext.Provider value={props.globalData}>{props.children}</DataContext.Provider>
            : null
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataContext.Provider')
    }
    return context;
}