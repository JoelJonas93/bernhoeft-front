import React from "react";
import { Alert, Button, Form, Modal, Pagination, Table } from "react-bootstrap";

class Produto extends React.Component {
    url = 'http://localhost:8080';
   constructor(props) {
        super(props);

        this.state = {
            id: 0,
            nome: '',
            descricao: '',
            preco: 0,
            situacao: 'ATIVO',
            produtos: [],
            categorias: [],
            modalOpen: false,
            nomeFilter: null,
            descricaoFilter: null,
            situacaoFilter: 'Todos',
            categoriaFilter: 'Todos',
            limitPerPage: 5,
            limit: 10,
            activePage: 1
        }
    }

    componentDidMount() {
        console.log(process.env.REACT_APP_TITLE)
        this.buscarProduto();
        this.buscarCategoria();
    }

    componentWillUnmount() {

    }

    buscarProduto() {
        fetch(this.url + '/produto/findall', {mode: 'cors', method: 'GET'})
        .then(response => response.json())
        .then(datas => {
            this.setState({produtos:datas})
        })
    }

    buscarCategoria() {
        fetch(this.url + '/categoria/findall', {mode: 'cors', method: 'GET'})
        .then(response => response.json())
        .then(datas => {
            this.setState({categorias:datas})
        })
    }

    deletarProduto = (produto) => {
        fetch(this.url + '/produto/delete', 
        {mode: 'cors',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, 
            method: 'DELETE', body: JSON.stringify(produto)})
        .then(response => {
            if(response.ok) {
                this.buscarProduto();
                alert(produto.nome + " deletado com sucesso!")
            } else {
                this.showConfirmationModal();
            }
        })
    }

    cadastrarProduto = (produto) => {
        fetch(this.url + '/produto/save', 
        {mode: 'cors',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, 
            method: 'POST', body: JSON.stringify(produto)})
        .then(response => {
            if(response.ok) {
                this.hideModal();
                this.buscarProduto();
            }
        })
    }

    atualizarProduto = (produto) => {
        fetch(this.url + '/produto/update', 
        {mode: 'cors',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, 
            method: 'POST', body: JSON.stringify(produto)})
        .then(response => {
            if(response.ok) {
                this.hideModal();
                this.buscarProduto();
                alert(produto.nome + " atualizado com sucesso!")
            }
        })
    }

    submit = () => {
        if(this.state.id === 0) {
            const produto = {
                nome: this.state.nome,
                descricao: this.state.descricao,
                preco: this.state.preco,
                situacao: this.state.situacao.toUpperCase()
            }
            this.cadastrarProduto(produto);
        } else {
            const produto = {
                id: this.state.id,
                nome: this.state.nome,
                descricao: this.state.descricao,
                preco: this.state.preco,
                situacao: this.state.situacao.toUpperCase()
            }
            this.atualizarProduto(produto);
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

    carregarProduto = (produto) => {
        this.setState({id: produto.id, nome: produto.nome, descricao: produto.descricao, preco: produto.preco, situacao: produto.situacao});
        this.showModal();
    }

    atualizaNome = (e) => {
        this.setState({nome: e.target.value});
    }

    atualizaDescricao = (e) => {
        this.setState({descricao: e.target.value});
    }

    atualizaPreco = (e) => {
        this.setState({preco: e.target.value});
    }

    atualizaSituacao = (e) => {
        this.setState({situacao: e.target.value});
    }

    showModal = () => {
        this.setState({modalOpen: true});
    }

    hideModal = () => {
        this.setState({modalOpen: false});
        this.setState({id: 0, nome: '', descricao: '', preco: 0, situacao: ''});
    }

    handlePageChange = (pageNumber) => {
        this.setState((prev) => ({ ...prev, activePage: pageNumber }));
    
        fetch(this.url + '/produto/findall', {mode: 'cors', method: 'GET'})
        .then(response => response.json())
        .then(datas => {
            console.log(datas)
            this.setState({produtos:datas})
        })
    }

    renderModal() {
        return (
            <Modal show={this.state.modalOpen} onHide={this.hideModal}>
                <Modal.Header closeButton>
                <Modal.Title>Dados do Produto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Produto</Form.Label>
                            <Form.Control type="text" placeholder="Nome do Produto" value={this.state.nome} onChange={this.atualizaNome}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control type="text" placeholder="Descrição" value={this.state.descricao} onChange={this.atualizaDescricao}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Preço</Form.Label>
                            <Form.Control type="numer" placeholder="Descrição" value={this.state.preco} onChange={this.atualizaPreco}/>
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

    render() {
        let filteredData = this.state.produtos;

        if(this.state.situacaoFilter) {
            if(this.state.situacaoFilter === 'Todos') {
                filteredData = this.state.produtos;
            } else {
                filteredData = this.state.produtos.filter(
                    (dt) => dt.situacao.toUpperCase() === this.state.situacaoFilter.toUpperCase()
                );
            }
        }

        if(this.state.nomeFilter) {
            filteredData = this.state.produtos.filter(
                (dt) => dt.nome.toUpperCase().includes(this.state.nomeFilter.toUpperCase())
            );
        }

        if(this.state.descricaoFilter) {
            filteredData = this.state.produtos.filter(
                (dt) => dt.descricao.toUpperCase().includes(this.state.descricaoFilter.toUpperCase())
            );
        }

        return (
            <div>
                <Button className='mt-2 mb-2' variant="primary" onClick={this.showModal}>
                    Cadastrar Produto
                </Button>

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control as='select'  value={this.state.categoriaFilter} onChange={(e) =>
                                    this.setState({ categoriaFilter: e.target.value })}>
                            <option value="Todos">Todos</option>
                            {
                                this.state.categorias.map((categoria) => {
                                    <option value={categoria.nome}>{categoria.nome}</option>
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                </Form> 

                <Form>
                    <Form.Group className="mb-3">
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
                            <th>Descrição
                                <br />
                                <input
                                    type="text"
                                    value={this.state.descricaoFilter}
                                    onChange={(e) =>
                                    this.setState({ descricaoFilter: e.target.value })
                                    }
                                />
                            </th>
                            <th>Preço</th>
                            <th>Criado em</th>
                            <th>Atualizado em</th>
                            <th>Situação</th>
                            <th>Opções</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredData.map((produto) =>
                                <tr>
                                    <td>{produto.id}</td>
                                    <td>{produto.nome}</td>
                                    <td>{produto.descricao}</td>
                                    <td>{produto.preco}</td>
                                    <td>{this.convertDate(produto.criadoEm)}</td>
                                    <td>{this.convertDate(produto.atualizadoEm)}</td>
                                    <td>{produto.situacao}</td>
                                    <td><Button variant="warning" onClick={() => this.carregarProduto(produto)}>Atualizar</Button> <Button variant="danger" onClick={() => this.deletarProduto(produto)}>Excluir</Button></td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>

                {/* <Pagination className="px-4">
                    {this.state.produtos.map((_, index) => {
                    return (
                        <Pagination.Item
                            onClick={() => this.handlePageChange(index + 1)}
                            key={index + 1}
                            active={index + 1 === this.state.activePage}
                            >
                            {index + 1}
                        </Pagination.Item>
                    );
                    })}
                </Pagination> */}
            </div>
        )
    }
}

export default Produto;