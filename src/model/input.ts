import * as core from '@actions/core'

function parsInputToArray(input: string, options?: core.InputOptions): string[] {
  const str = core.getInput(input, options)
  return (str || null)?.split(',') ?? []
}

export class Input {
  token: string
  prNumber: string
  prTitle: string
  prBody: string
  prBodyWithLinks: boolean
  prLabels: string[]
  prAssignees: string[]
  prUpdateType: string

  constructor() {
    this.token = core.getInput('token', {required: true})
    this.prNumber = core.getInput('pr_number', {required: true})
    this.prTitle = core.getInput('pr_title')
    this.prBody = core.getInput('pr_body')
    this.prBodyWithLinks = core.getInput('pr_body_with_links') === 'true' // getBooleanInput() raises TypeError!
    this.prLabels = parsInputToArray('pr_labels')
    this.prAssignees = parsInputToArray('pr_assignees')
    this.prUpdateType = core.getInput('pr_update_type')

    core.setSecret(this.token)
  }
}
