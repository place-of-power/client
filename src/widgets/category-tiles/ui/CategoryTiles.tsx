import { Component } from 'react'
import { CategoryTile } from '@/entities/category'
import type { Category } from '@/entities/category'
import './CategoryTiles.css'

interface CategoryTilesProps {
    categories: Category[]
}

class CategoryTiles extends Component<CategoryTilesProps> {
    render() {
        const { categories } = this.props

        if (categories.length === 0) {
            return null
        }

        return (
            <section className="category-tiles">
                <h2 className="category-tiles-title">Категории</h2>
                <div className="category-tiles-grid">
                    {categories.map((category) => (
                        <CategoryTile key={category.id} category={category} />
                    ))}
                </div>
            </section>
        )
    }
}

export default CategoryTiles
