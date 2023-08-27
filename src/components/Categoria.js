import React from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";

class Categoria extends React.Component {
    url = 'http://localhost:8080';
    constructor(props) {
        super(props);


        this.state = {
            id: 0,
            nome: '',
            situacao: 'ATIVO',
            categorias: [],
            modalOpen: false,
            confirmationModalOpen: false,
            nomeFilter: null,
            situacaoFilter: 'Todos',
        }
    }

    componentDidMount() {
        this.buscarCategoria();
    }

    componentWillUnmount() {

    }

    buscarCategoria() {
        fetch(this.url + '/categoria/findall', {mode: 'cors', method: 'GET'})
        .then(response => response.json())
        .then(datas => {
            this.setState({categorias:datas})
        })
    }

    deletarCategoria = (categoria) => {
        fetch(this.url + '/categoria/delete', 
        {mode: 'cors',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, 
            method: 'DELETE', body: JSON.stringify(categoria)})
        .then(response => {
            if(response.ok) {
                this.buscarCategoria();
                alert(categoria.nome + " deletado com sucesso!")
            } else {
                this.showConfirmationModal();
            }
        })
    }

    cadastrarCategoria = (categoria) => {
        fetch(this.url + '/categoria/save', 
        {mode: 'cors',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, 
            method: 'POST', body: JSON.stringify(categoria)})
        .then(response => {
            if(response.ok) {
                this.hideModal();
                this.buscarCategoria();
            }
        })
    }

    atualizarCategoria = (categoria) => {
        fetch(this.url + '/categoria/update', 
        {mode: 'cors',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, 
            method: 'POST', body: JSON.stringify(categoria)})
        .then(response => {
            if(response.ok) {
                this.hideModal();
                this.buscarCategoria();
                alert(categoria.nome + " atualizado com sucesso!")
            }
        })
    }

    submit = () => {
        if(this.state.id === 0) {
            const categoria = {
                nome: this.state.nome,
                situacao: this.state.situacao.toUpperCase()
            }
            this.cadastrarCategoria(categoria);
        } else {
            const categoria = {
                id: this.state.id,
                nome: this.state.nome,
                situacao: this.state.situacao.toUpperCase()
            }
            this.atualizarCategoria(categoria);
        }
    }

    convertDate = (string) => {
        const today = new Date(string);
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        return dd + '/' + mm + '/' + yyyy;
    }

    carregarCategoria = (categoria) => {
        this.setState({id: categoria.id, nome: categoria.nome, situacao: categoria.situacao});
        this.showModal();
    }

    atualizaNome = (e) => {
        this.setState({nome: e.target.value});
    }

    atualizaSituacao = (e) => {
        this.setState({situacao: e.target.value});
    }

    showModal = () => {
        this.setState({modalOpen: true});
    }

    hideModal = () => {
        this.setState({modalOpen: false});
        this.setState({id: 0, nome: '', situacao: ''});
    }

    showConfirmationModal = () => {
        this.setState({confirmationModalOpen: true});
    }

    hideConfirmationModal = () => {
        this.setState({confirmationModalOpen: false});
    }

    renderModal() {
        return (
            <Modal show={this.state.modalOpen} onHide={this.hideModal}>
                <Modal.Header closeButton>
                <Modal.Title>Dados da Categoria</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Control type="text" placeholder="Nome da Categoria" value={this.state.nome} onChange={this.atualizaNome}/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Situação</Form.Label>
                            <Form.Select value={this.state.situacao} onChange={this.atualizaSituacao}>
                                <option value="ATIVO">Ativo</option>
                                <option value="INATIVO">Inativo</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>                    
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={this.hideModal}>
                    Cancelar
                </Button>
                <Button variant="primary" type="submit" onClick={this.submit}>
                    Salvar
                </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    renderConfirmationModal() {
        return (
            <Modal show={this.state.confirmationModalOpen} onHide={this.hideConfirmationModal}>
                <Modal.Header closeButton>
                <Modal.Title>Confirmação</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Categoria não pode ser excluído, existe produto atrelado a ela.            
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={this.hideConfirmationModal}>
                    Ok
                </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    render() {
        let filteredData = this.state.categorias;
        
        if(this.state.situacaoFilter) {
            if(this.state.situacaoFilter === 'Todos') {
                filteredData = this.state.categorias;
            } else {
                filteredData = this.state.categorias.filter(
                    (dt) => dt.situacao.toUpperCase() === this.state.situacaoFilter.toUpperCase()
                );
            }
        }

        if(this.state.nomeFilter) {
            filteredData = this.state.categorias.filter(
                (dt) => dt.nome.toUpperCase().includes(this.state.nomeFilter.toUpperCase())
            );
        }

        return (
            <div>
                <Button className='mt-2 mb-2' variant="primary" onClick={this.showModal}>
                    Cadastrar Categoria
                </Button>

                <Form>
                    <Form.Group className="mb-3 mw-50">
                        <Form.Label>Situação</Form.Label>
                        <Form.Select value={this.state.situacaoFilter} onChange={(e) =>
                                    this.setState({ situacaoFilter: e.target.value })}>
                            <option value="Todos">Todos</option>
                            <option value="ATIVO">Ativo</option>
                            <option value="INATIVO">Inativo</option>
                        </Form.Select>
                    </Form.Group>
                </Form> 

                {this.renderModal()}
                {this.renderConfirmationModal()}
                
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nome
                                <br />
                                <input
                                    type="text"
                                    value={this.state.nomeFilter}
                                    onChange={(e) =>
                                    this.setState({ nomeFilter: e.target.value })
                                    }
                                />
                            </th>
                            <th>Criado em</th>
                            <th>Atualizado em</th>
                            <th>Situação</th>
                            <th>Opções</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredData.map((categoria) =>
                                <tr>
                                    <td>{categoria.id}</td>
                                    <td>{categoria.nome}</td>
                                    <td>{this.convertDate(categoria.criadoEm)}</td>
                                    <td>{this.convertDate(categoria.atualizadoEm)}</td>
                                    <td>{categoria.situacao}</td>
                                    <td><Button variant="warning" onClick={() => this.carregarCategoria(categoria)}>Atualizar</Button> <Button variant="danger" onClick={() => this.deletarCategoria(categoria)}>Excluir</Button></td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default Categoria;