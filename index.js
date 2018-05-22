#!/usr/bin/env node
const path = require('path')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const Executor = require('./src/classes/executor')

module.exports.SuiteConsoleReporter = require('./src/classes/report/suite.console.reporter')
module.exports.Reporter = require('./src/classes/report/test.reporter')
module.exports.TestSuite = require('./src/classes/scope/test.suite')
module.exports.ExitCondition = require('./src/classes/exit/exit.condition')
module.exports.TestContext = require('./src/classes/context/test.context')
module.exports.ThreadContext = require('./src/classes/context/thread.context')
module.exports.SuiteContext = require('./src/classes/context/suite.context')
module.exports.Injector = require('./src/di/injector')
module.exports.Wrapper = require('./src/di/wrapper')

const optionDefinitions = [
	{
		name: 'config',
		type: String,
		description: 'Configuration file.',
		typeLabel: '<file>' },
	{
		name: 'tests',
		type: String,
		description: 'Tests Directory',
		typeLabel: '<dir>' },
	{
		name: 'suite',
		type: String,
		description: 'Test Suite',
		typeLabel: '<file>' },
	{
		name: 'context',
		type: String,
		description: 'Test Suite Context',
		typeLabel: '<file>' }
]
const usage = commandLineUsage([
	{
		header: 'Options',
		optionList: optionDefinitions
	},
	{
		header: 'Example:',
		content:
		'taf --config <configFile>\n'+
		'taf --tests <testsFolder> --suite <suiteFile> --context <contextFile>\n' +
		'taf --config <configFile> --suite <suiteFile>'
	}
])
const options = commandLineArgs(optionDefinitions)
let config = {}
if (options.config) {
	const loadedConfig = require(path.resolve(options.config))
	Object.assign(config, loadedConfig)
	config.tests = path.resolve(loadedConfig.tests)
	config.suite = require(path.resolve(loadedConfig.suite))
	config.context = require(path.resolve(loadedConfig.context))
}
if (options.tests) {
	config.tests = path.resolve(options.tests)
}
if (options.suite) {
	config.suite = require(path.resolve(options.suite))
}
if (options.context) {
	config.context = require(path.resolve(options.context))
}
if (config.tests) {
	new Executor()
		.configure(config)
		.execute(config.suite, config.context)
		.then(r => console.log('DONE'))
} else {
	console.log(usage)
}