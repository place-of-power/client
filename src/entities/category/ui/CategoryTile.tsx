import { Component } from 'react'
import { Link } from 'react-router-dom'
import { paths } from '@/shared/config'
import type { Category } from '@/shared/model/category'
import './CategoryTile.css'

interface CategoryTileProps {
    category: Category
    count?: number
}

class CategoryTile extends Component<CategoryTileProps> {
    renderMonogram(name: string) {
        return name.replace(/\s+/g, '').slice(0, 2).toUpperCase()
    }

    render() {
        const { category, count } = this.props

        return (
            <Link className="category-tile" to={paths.category(category.slug)}>
                <span className="category-tile-monogram">
                    {this.renderMonogram(category.name)}
                </span>
                <span className="category-tile-name">{category.name}</span>
                {typeof count === 'number' && (
                    <span className="category-tile-count">{count}</span>
                )}
            </Link>
        )
    }
}

export default CategoryTile
