"use client"

import { createContext, useState } from "react";

type WrapperContextType = {
  file: File | null;
  setFile: (file: File | null) => void;
};

const WrapperContext = createContext<WrapperContextType>({
  file: null,
  setFile: (file: File | null) => {},
});

export function WrapperProvider({ children }: { children: React.ReactNode }) {
    const [file, setFile] = useState<File | null>(null)
    
    return (
        <WrapperContext.Provider value={{ file, setFile }}>
            {children}
        </WrapperContext.Provider>
    )
    

}

export default WrapperContext;
