// Interface
export default interface ITask {
  id: number;
  titulo: string;
  descricao: string;
  status: string | number;
  dataCriacao: Date;
  dataConclusao: Date | null;
}

export default interface ApiResponse {
  status: string | number;
  message: string;
  data: {
    tasks: ITask[];
    pagination?: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
  };
}
