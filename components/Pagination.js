export default function Pagination({pagesCount, currentPage, onPageChange}){

    if (pagesCount === 1) return null;
    const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);

    return(
        <nav className="py-3 d-flex justify-content-center sticky-bottom">
            <ul class="pagination pagination-md">
                {
                    currentPage > 1 ?
                    <li class="page-item">
                        <a class="page-link" aria-label="Previous" onClick={() => onPageChange(currentPage - 1)}>
                            <span aria-hidden="true">Previous</span>
                        </a>
                    </li> : ""
                }
                
                {pages.map(page => (
                    <li class={`page-item ${currentPage === page ? 'active' : ''}`} key={page}>
                        <a class="page-link" onClick={() => onPageChange(page)}>{page}</a>
                    </li>
                ))}

                {
                    currentPage < pagesCount ?
                    <li class="page-item">
                        <a class="page-link" aria-label="Next" onClick={() => onPageChange(currentPage + 1)}>
                            <span aria-hidden="true">Next</span>
                        </a>
                    </li> : ""
                }
                
            </ul>
        </nav>
    )
}