import { Component } from 'react'
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
            <div className="category-tile">
                <span className="category-tile-monogram">
                    {this.renderMonogram(category.name)}
                </span>
                <span className="category-tile-name">{category.name}</span>
                {typeof count === 'number' && (
                    <span className="category-tile-count">{count}</span>
                )}
            </div>
        )
    }
}

export default CategoryTile
