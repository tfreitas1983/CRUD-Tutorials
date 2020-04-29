import React, { Component } from "react"
import TutorialDataService from "../services/tutorial.service"
import { Link } from "react-router-dom"

export default class TutorialsList extends Component {
    constructor(props) {
    super(props)
    this.onchangeSearchTitle = this.onchangeSearchTitle.bind(this)
    this.retrieveTutorials = this.retrieveTutorials.bind(this)
    this.refreshList = this.refreshList.bind(this)
    this.setActiveTutorial = this.setActiveTutorial.bind(this)
    this.removeAllTutorials = this.removeAllTutorials.bind(this)
    this.searchTitle = this.searchTitle.bind(this)

        this.state = {
            tutorials: [],
            currentTutorial: null,
            currentIndex: -1,
            searchTitle: ""
        }
    }
    
    componentDidMount() {
        this.retrieveTutorials()
    }

    onchangeSearchTitle(e) {
        const searchTitle = e.target.value

        this.setState({
            searchTitle: searchTitle
        })
    }

    retrieveTutorials() {
        TutorialDataService.getAll()
            .then(response => {
                this.setState({
                    tutorials: response.data
                })
                console.log(response.data)
            })
            .catch (e => {
                console.log(e)
            })
    }

    refreshList() {
        this.retrieveTutorials()
        this.setState({
            currentTutorial: null,
            currentIndex: -1
        })
    }

    setActiveTutorial(tutorial, index) {
        this.setState({
            currentTutorial: tutorial,
            currentIndex: index
        })
    }

    removeAllTutorials() {
        TutorialDataService.deleteAll()
            .then(response => {
                console.log(response.data)
                this.refreshList()
            })
            .catch(e => {
                console.log(e)
            })
    }

    searchTitle() {
        TutorialDataService.findByTitle(this.state.searchTitle)
            .then(response => {
                this.setState({
                    tutorials: response.data
                })
                console.log(response.data)
            })
            .catch(e => {
                console.log(e)
            })
    }

    render() {
        const { searchTitle, tutorials, currentTutorial, currentIndex } = this.state

        return (
            <div className="list row">
                <div className="col-md-8">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Busque pelo título"
                            value={searchTitle}
                            onChange={this.onchangeSearchTitle}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={this.searchTitle}
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <h4>Lista de Tutoriais</h4>

                    <ul className="list-group">
                        {tutorials && tutorials.map ((tutorial, index) => (
                            <li
                                className={"list-group-item " + (index === currentIndex ? "active" : "")}                            
                                onClick={() => this.setActiveTutorial(tutorial, index)}
                                key={index}
                            >
                                {tutorial.title}
                            </li>
                        ))}
                    </ul>

                    <button className="m-3 btn btn-sm btn-danger" onClick={this.removeAllTutorials}>
                        Apagar todos
                    </button>
                </div>

                <div className="col-md-6">
                    {currentTutorial ? (
                        <div>
                            <h4>Tutorial</h4>
                            <div>
                                <label>
                                    <strong>Título:</strong>
                                </label>{" "}
                                {currentTutorial.title}
                            </div>
                            <div>
                                <label>
                                    <strong>Descrição:</strong>
                                </label>{" "}
                                {currentTutorial.description}
                            </div>
                            <div>
                                <label>
                                    <strong>Status:</strong>
                                </label>{" "}
                                {currentTutorial.published ? "Publicado" : "Pendente"}
                            </div>

                            <Link to={"/tutorials/" + currentTutorial.id} className="badge badge-warning">
                                Editar
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <br />
                            <p>Selecione um tutorial...</p>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}