import { Component } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ArticlePageRoute } from '@/pages/article'
import { HomePage } from '@/pages/home'
import { Header } from '@/widgets/header'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/articles/:slug" element={<ArticlePageRoute />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        )
    }
}

export default App
