import CheckroomRoundedIcon from '@mui/icons-material/CheckroomRounded'
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded'
import HandymanRoundedIcon from '@mui/icons-material/HandymanRounded'
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded'
import SpaRoundedIcon from '@mui/icons-material/SpaRounded'
import WeekendRoundedIcon from '@mui/icons-material/WeekendRounded'
import type { ReactElement } from 'react'
import type { EntrepreneurshipCategory } from '../../domain/EntrepreneurshipCategory'

export const categoryIcons: Record<EntrepreneurshipCategory['icon'], ReactElement> = {
  food: <RestaurantRoundedIcon fontSize="small" />,
  crafts: <HandymanRoundedIcon fontSize="small" />,
  fashion: <CheckroomRoundedIcon fontSize="small" />,
  beauty: <SpaRoundedIcon fontSize="small" />,
  home: <WeekendRoundedIcon fontSize="small" />,
  construction: <ConstructionRoundedIcon fontSize="small" />,
}
