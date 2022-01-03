import React, {useState} from 'react';
import './App.css';
import {Form, Input} from "antd";
import allApeFeatures from "./data/ape_features.json";
import images from "./data/images.json";
import rarities from "./data/rarities.json";

const AllApeFeatures: Record<string, any[]> = allApeFeatures as any
const Images: Record<string, string> = images as any
const Rarities: Record<string, number> = rarities as any

function isApeIdValid(apeId: string){
    const parsed = parseInt(apeId)

    return !isNaN(parsed) && parsed >= 0 && parsed < 10000
}

function App() {
    const [apeId, setApeId] = useState("")
    const parsedApeId = isApeIdValid(apeId) ? parseInt(apeId).toString() : null
    const apeFeatures = parsedApeId ? AllApeFeatures[parsedApeId] : null

    return (
        <div className="app">
            <h1>SODIUM FPE</h1>

            <Form className="form">
                <Form.Item
                    name="ape_id"
                    rules={[{
                        validator: async (rule: any, value: string, cb: (msg?: string) => void) => {
                            if (!isApeIdValid(value)){
                                throw new Error("Please enter an ID between 0 and 9999")
                            }
                        }
                    }]}
                >
                    <Input
                        value={apeId}
                        onChange={e => setApeId(e.target.value)}
                        placeholder="Enter Ape ID..."
                    />
                </Form.Item>
            </Form>

            {parsedApeId && <>
                <div className="mainApe">
                    <ApeImage apeId={parsedApeId}/>

                    <div className="fairPrice">

                        <em>#{parsedApeId}</em>
                        <span>Rarity #{Rarities[parsedApeId]}</span>
                        <strong>
                            Fair Price: {(apeFeatures!.reduce((s, feature: any) => s+feature.priceInCrypto, 0)/5).toFixed(2)} ETH.
                        </strong>
                    </div>
                </div>

                <div className="divider"><em>Based on...</em></div>

                <div className="featureApes">
                    {apeFeatures!.map((f: any, n) => (
                        <FeatureApe f={f} key={n}/>
                    ))}
                </div>
            </>}
        </div>
    );
}

function FeatureApe({f}:{f:any}){
    const d = (new Date(f.soldAt)).toISOString()

    return (
        <div className="featureApe">
            <ApeImage apeId={f.id} key={f.id}/>
            <em>#{f.id}</em>
            <span>{f.priceInCrypto} ETH</span>
            <span>{d.substring(0, 10)} {d.substring(11, 16)}</span>
            <span>Rarity #{f.RarityRank}</span>
        </div>
    )
}

function ApeImage({ apeId }: {apeId: string}){
    return <img src={`https://ipfs.io/ipfs/${Images[apeId]}`} width="200px" height="200px" alt="Loading..." className="apeImage"/>
}

export default App;
