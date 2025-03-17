const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
      const matriculas = req.body.map(item => ({
        aluno: item.aluno,
        disciplina: item.disciplina
      }));
  
      const result = await prisma.matricula.createMany({
        data: matriculas
      });
  
      res.status(201).json({ message: 'Matrículas criadas com sucesso!', result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar matrículas' });
    }
  };

const read = async (req, res) => {
    try {
        const matriculas = await prisma.matricula.findMany({
            include: {
                contem: true,   
                faz: true       
            }
        });

        return res.json(matriculas);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const readOne = async (req, res) => {
    try {
        const matricula = await prisma.matricula.findUnique({
            where: {
                id: parseInt(req.params.id)  
            },
            include: {
                contem: true,
                faz: true
            }
        });

        if (!matricula) {
            return res.status(404).json({ error: "Matrícula não encontrada" });
        }

        return res.json(matricula);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { aluno, disciplina } = req.body;

        const matricula = await prisma.matricula.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                aluno,
                disciplina
            }
        });

        return res.status(202).json(matricula);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        await prisma.matricula.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });

        return res.status(204).send(); 
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
};

module.exports = { create, read, readOne, update, remove };