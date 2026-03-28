//Vamos lá aprender a usar essa bagaça
class EventModel {
    //Simulando uma requisição
    static async buscarEventos() {
        return [
            { id: 1, titulo: "Feira do Rolo", categoria: "Tecnologia", dataInicio: "01-02-2023", dataFim: "02-02-2023", descricao: "Muitos rolos", local:"Rua Avenildo lopes segundo"},
            { id: 2, titulo: "Guerra de Robos", categoria: "Tecnologia", dataInicio: "07-05-2023", dataFim: "07-05-2023", descricao: "Muita Guerra", local:"Rua Avenildo lopes segundo"},
            { id: 3, titulo: "WorkShop do Pão", categoria: "Comida", dataInicio: "23-09-2023", dataFim: "23-09-2023", descricao: "Muitos Pães e Bolos", local:"Rua Avenildo lopes segundo"},
        ]
    }
}