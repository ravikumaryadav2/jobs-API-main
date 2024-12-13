const Job = require("../models/Job");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.id }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { id },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({ _id: jobId, createdBy: id });

  if (!job) {
    throw new NotFoundError(`Job with id ${jobId} not found`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.id;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { id },
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("Please provide company and position");
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!job) {
    throw new NotFoundError(`Job with id ${jobId} not found`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { id },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndRemove({
    _id: jobId,
    createdBy: id,
  });

  if (!job) {
    throw new NotFoundError(`Job with id ${jobId} not found`);
  }

  res.status(StatusCodes.OK).send()
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
