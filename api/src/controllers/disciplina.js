const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const disciplina = await prisma.disciplina.create({
            data: req.body
        });
        res.status(201).json(disciplina);
    } catch (error) {
        if (error.code == 'P2003')
            res.status(404).json({ erro: error.meta.field_name + ' não encontrada(o)' });
        else
            res.status(400).json(error);
    }
};

const read = async (req, res) => {
    const disciplinas = await prisma.disciplina.findMany();
    res.status(200).json(disciplinas);
};

const readOne = async (req, res) => {
    try {
        const disciplina = await prisma.disciplina.findUnique({
            select: {
                id: true,
                nome: true,
                turma: true,
                professor: true,
                possui: {
                    select: {
                        nome: true
                    }
                },
                leciona: {
                    select: {
                        nome: true
                    }
                },
                matriculas: true
            },
            where: {
                id: Number(req.params.id)
            }
        });
        return res.json(disciplina);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const update = async (req, res) => {
    try {
        const disciplina = await prisma.disciplina.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        });
        return res.status(202).json(disciplina);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const remove = async (req, res) => {
    try {
        await prisma.disciplina.delete({
            where: {
                id: Number(req.params.id)
            }
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

module.exports = {
    create,
    read,
    readOne,
    update,
    remove
};