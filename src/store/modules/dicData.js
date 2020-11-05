const dicData = {
  state: {
    whether: [
      {
        value: 'Y',
        label: '是'
      },
      {
        value: 'N',
        label: '否'
      }
    ],
    whetherAll: [
      {
        value: '',
        label: '全部'
      },
      {
        value: 'Y',
        label: '是'
      },
      {
        value: 'N',
        label: '否'
      }
    ],
    gender: [
      {
        value: 'M',
        label: '男'
      },
      {
        value: 'F',
        label: '女'
      }
    ],
    genderAll: [
      {
        value: '',
        label: '全部'
      },
      {
        value: 'M',
        label: '男'
      },
      {
        value: 'F',
        label: '女'
      }
    ],
    doctorType: [
      {
        value: 'DOCTOR',
        label: '医生'
      },
      {
        value: 'DOCTOR_STAR',
        label: '名医'
      }
    ],
    medicinalStands: [
      {
        value: '统',
        label: '统'
      }
    ],
    conflictType: [
      {
        label: '十八反十九畏',
        value: 'EAN'
      },
      {
        label: '毒性',
        value: 'TOXIC'
      }
    ],
    recipeTemplateType: [
      {
        label: '经典模板',
        value: 'CLASSIC'
      },
      {
        label: '医生自建模板',
        value: 'PRIVATE'
      }
    ],
    recipeTypes: [
      {
        label: '代煎',
        value: 'FRIED'
      },
      {
        label: '自煎',
        value: 'SELF_FRIED'
      },
      {
        label: '膏方',
        value: 'CREAM_FORMULA'
      }
    ],
    recipeTypeAll: [
      {
        label: '全部',
        value: ''
      },
      {
        label: '经典模板',
        value: 'CLASSIC'
      },
      {
        label: '医生自建模板',
        value: 'PRIVATE'
      }
    ],
    druggingOrders: [
      {
        label: '先煎药',
        value: 'FRIED_FIRST'
      },
      {
        label: '后下药',
        value: 'FRIED_LAST'
      },
      {
        label: '包煎药',
        value: 'FRIED_PACKAGE'
      },
      {
        label: '烊化药',
        value: 'UNIFY'
      },
      {
        label: '兑服药',
        value: 'SURRENDER'
      },
      {
        label: '捣碎药',
        value: 'MASHED'
      }
    ],
    grabMedicineTypes: [
      {
        label: '代煎',
        value: 'FRIED'
      },
      {
        label: '代配',
        value: 'SUBSTITUTE'
      }
    ]
  }

}

export default dicData
