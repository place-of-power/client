import { Component } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ArticlePageRoute } from '@/pages/article'
import { CategoriesPage } from '@/pages/categories'
import { CategoryPage } from '@/pages/category'
import { CreateArticlePage } from '@/pages/create-article'
import { CreateCategoryPage } from '@/pages/create-category'
import { HomePage } from '@/pages/home'
import { ManageCategoriesPage } from '@/pages/manage-categories'
import { ROUTES } from '@/shared/config'
import { Header } from '@/widgets/header'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path={ROUTES.home} element={<HomePage />} />
                    <Route path={ROUTES.categories} element={<CategoriesPage />} />
                    <Route path={ROUTES.createCategory} element={<CreateCategoryPage />} />
                    <Route path={ROUTES.manageCategories} element={<ManageCategoriesPage />} />
                    <Route path={ROUTES.category} element={<CategoryPage />} />
                    <Route path={ROUTES.article} element={<ArticlePageRoute />} />
                    <Route path={ROUTES.create} element={<CreateArticlePage />} />
                    <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
                </Routes>
            </BrowserRouter>
        )
    }
}

export default App
