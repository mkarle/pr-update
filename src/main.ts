import * as core from '@actions/core'
import * as github from '@actions/github'

import {Input} from './model/input'
import {PrUtils} from './util/prUtils'
import {BodyUtils} from './util/bodyUtils'

async function run(): Promise<void> {
  try {
    const input = new Input()
    const octokit = github.getOctokit(input.token)
    const pr = new PrUtils(octokit)
    const bodyUtils = new BodyUtils(octokit)

    core.startGroup('PR')
    const body =
      input.prBodyWithLinks === true
        ? await bodyUtils.withLinks(input.prSource, input.prTarget, input.prBody)
        : input.prBody || undefined
    if (input.prNumber) {
      core.info('♻️ Update PR')
      const pull = await pr.updatePr(
        Number(input.prNumber),
        input.prTitle,
        body,
        input.prLabels,
        input.prAssignees,
        input.prUpdateType
      )
      core.info(`🎉 Pull Request updated: ${pull.html_url} (#${pull.number})`)
      core.setOutput('pr_nr', pull.number)
    }
    core.endGroup()
  } catch (error) {
    if (error instanceof Error) core.setFailed(`💥 ${error.message}`)
  }
}

run()
