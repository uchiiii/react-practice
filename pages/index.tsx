import { useEffect, useState } from "react"
import { fetchImages, fetchCategories } from "./api/fetchImage"

function Header() {
  return (
    <header className="hero is-dark is-bold">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">Dog Images</h1>
        </div>
      </div>
    </header>
  );
}

function Form(props) {
  function handleSubmit(event) {
    event.preventDefault()
    const { breed } = event.target.elements
    props.onFormSubmit(breed.value)
  }
  const categories = props.categories
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="field has-addons">
          <div className="control is-expanded">
            <div className="select is-fullwidth">
              <select name="breed" defaultValue="shiba">
                {
                  categories? 
                    Object.keys(categories).map((cat) => {
                      return (
                        <option value={cat}>{cat}</option>
                      )
                    }) : null
                }
              </select>
            </div>
          </div>
          <div className="control">
            <button type="submit" className="button is-dark">
              Reload
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

type ImageProps = { src: string }
function Image(props: ImageProps) {
  return (
    <div className="card">
      <div className="card-image">
        <figure className="image">
          <img src={props.src} alt="cute dog!"/>
        </figure>
      </div>
    </div>
  );
}

function Loading() {
  return <p>Loading...</p>
}

type GalleryProps = {
  urls: string[] | null
}
function Gallery(props: GalleryProps) {
  const { urls } = props
  if (urls == null) {
    return <Loading />
  }
  return (
    <div className="columns is-vcentered is-multiline">
      {urls.map((url) => {
        return (
          <div key={url} className="column is-3">
            <Image src={url}/>
          </div>
        )
      })}
    </div>
  );
}

function Main() {
  const [urls, setUrls] = useState(null)
  useEffect(() => {
    fetchImages("shiba").then((urls) => {
      setUrls(urls)
    })
  }, [])
  const [categories, setCategories] = useState(null)
  useEffect(() => {
    fetchCategories().then((categories) => {
      setCategories(categories)
    })
  }, [])
  
  function reloadImage(breed) {
    fetchImages(breed).then((urls) => {
      setUrls(urls)
    }) 
  }
  return (
    <main>
      <section>
        <div className="container">
          <Form onFormSubmit={reloadImage} categories={categories}/>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Gallery urls={urls}/>
        </div>
      </section>
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="content has-text-centered">
        <p>Dog images are retrieved from Dog API</p>
        <p>
          <a href="https://dog.ceo/dog-api/about">Donate to Dog API</a>
        </p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;