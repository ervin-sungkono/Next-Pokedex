import { useState } from "react"
import Layout from "../../components/Layout"

export default function ItemsPage({items}){
    const [searchText, setSearchText] = useState("")
    
    const searchItem = () =>{
        const text = document.getElementById('search-field').value
        setSearchText(text)
    }

    const filteredItems = items.filter((item) => item.name.replace('-', ' ').includes(searchText.toLowerCase()))

    return(
        <>
            <Layout title="Item List">
                <div className="container min-vh-100">
                    <div className="row mb-4">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Enter item name" id="search-field"/>
                            <button class="btn btn-outline-warning" type="button" id="search-btn" onClick={() => searchItem()}>Search Item</button>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-light table-hover">
                            <thead>
                                <tr>
                                    <th className="col-1">#</th>
                                    <th className="col-2">Item Name</th>
                                    <th className="col-2">Category</th>
                                    <th className="col">Effect</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item, index) => (
                                    <tr class="" key={index}>
                                        <td scope="row"><img src={item.sprites.default} className="img-fluid"/></td>
                                        <td>{item.name.split('-').map((name) => name[0].toUpperCase() + name.substring(1)).join(' ')}</td>
                                        <td>{item.category.name.split('-').map((name) => name[0].toUpperCase() + name.substring(1)).join(' ')}</td>
                                        <td>{item.effect_entries[0].effect}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Layout>
        </>
    )
}

async function getItems(results){
    const items = await Promise.all(results.map(async(result) => {
        const {name, sprites, effect_entries, category} = await fetch(result.url).then(res => res.json())
        return {
            name : name,
            sprites : sprites,
            effect_entries: effect_entries,
            category : category
        }
    }))
    return items
}

export async function getStaticProps(){
    const {results} = await fetch("https://pokeapi.co/api/v2/item?limit=1607").then(res => res.json())

    const items = await getItems(results)

    return {
        props : {items : items}
    }
}