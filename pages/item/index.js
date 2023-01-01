import { useState } from "react"
import Layout from "../../components/Layout"
import Pagination from "../../components/Pagination"
import { paginate } from "../../helpers/paginate"

const PAGE_SIZE = 40
const ITEM_COUNT = 1607
const PAGES_COUNT = Math.ceil(ITEM_COUNT / PAGE_SIZE)

export default function ItemsPage({items}){
    const [searchText, setSearchText] = useState("")
    const searchItem = () =>{
        const text = document.getElementById('search-field').value
        setSearchText(text)
    }

    const [currentPage, setPage] = useState(1)
    const onPageChange = (page) => {
        setPage(page)
    }

    const filteredItems = items.filter((item) => item.name.replace('-', ' ').includes(searchText.toLowerCase()))

    const paginateItems = paginate(filteredItems, currentPage, PAGE_SIZE)

    return(
        <>
            <Layout title="Item List">
                <div className="container min-vh-100">
                    <div className="row mb-4">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Enter item name" id="search-field"/>
                            <button class="btn btn-warning" type="button" id="search-btn" onClick={() => searchItem()}>Search Item</button>
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
                                {paginateItems.map((item, index) => (
                                    <tr key={index}>
                                        <td scope="row"><img src={item.sprites?.default} className="img-fluid"/></td>
                                        <td>{item.name?.split('-').map((name) => name[0]?.toUpperCase() + name.substring(1)).join(' ')}</td>
                                        <td>{item.category?.name?.split('-').map((name) => name[0]?.toUpperCase() + name.substring(1)).join(' ')}</td>
                                        <td>{item.effect_entries[0]?.effect}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        pagesCount={Math.ceil(filteredItems.length / PAGE_SIZE)}
                        currentPage={currentPage}
                        onPageChange={onPageChange}
                    />
                </div>
            </Layout>
        </>
    )
}

async function getItems(results){
    const finalResults = []
    for(let i = 0; i < PAGES_COUNT; i++){
        const promises = []
        const res = await fetch(`https://pokeapi.co/api/v2/item?limit=${PAGE_SIZE}&offset=${i * PAGE_SIZE}`)
        const {results} = await res.json()
        results.forEach((result) => {
            promises.push(fetch(result.url).then(res => res.json()))
        })
        const items = await Promise.all(promises)
            .then(items => items.map(item => {
                return {
                    name : item.name,
                    sprites : item.sprites,
                    effect_entries: item.effect_entries,
                    category : item.category
                }
            }))  
        items.forEach(item => finalResults.push(item))
    }
    return finalResults
}

export async function getStaticProps(){
    const items = await getItems()

    if(!items)
    return {
        notFound: true
    }

    return {
        props : {
            items : items,
        }
    }
}